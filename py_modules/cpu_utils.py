from enum import Enum
import os
import re
import subprocess
import shutil
import decky_plugin
import file_timeout
import advanced_options
from time import sleep
import device_utils

LOCAL_RYZENADJ = f'{decky_plugin.DECKY_USER_HOME}/.local/bin/ryzenadj'
NIX_RYZENADJ = f'{decky_plugin.DECKY_USER_HOME}/.nix-profile/bin/ryzenadj'

RYZENADJ_PATH = None
if not device_utils.is_intel():
  # allow for custom override of ryzenadj for SteamOS
  if os.path.exists(LOCAL_RYZENADJ):
    RYZENADJ_PATH = LOCAL_RYZENADJ
  elif os.path.exists(NIX_RYZENADJ):
    RYZENADJ_PATH = NIX_RYZENADJ
  else:
    RYZENADJ_PATH = shutil.which('ryzenadj')


def set_tdp(tdp: int):
  if not advanced_options.tdp_control_enabled():
    return


  tdp_microwatts = tdp * 1000000
  try:
    cmd = f"echo '{tdp_microwatts}' | sudo tee {tdp_path}"
    result = subprocess.run(cmd, shell=True, check=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return result
  except Exception as e:
    decky_plugin.logger.error(f'{__name__} Error: set_tdp intel {e}')
  else:
    return set_amd_tdp(tdp)

def set_amd_tdp(tdp: int):
  try:

    tdp = tdp*1000

    if RYZENADJ_PATH:
      commands = [
        RYZENADJ_PATH,
        '--stapm-limit', f"{tdp}",
        '--fast-limit', f"{tdp}",
        '--slow-limit', f"{tdp}",
        '--tctl-temp', f"95",
        '--apu-skin-temp', f"95",
        '--dgpu-skin-temp', f"95"
      ]

      commands.append(f"{tdp}")

      decky_plugin.logger.info(f'setting TDP via ryzenadj with args {commands}')

      results = subprocess.call(commands)
      return results
  except Exception as e:
    decky_plugin.logger.error(e)

def get_online_cpus():
  try:
    with open('/sys/devices/system/cpu/online', 'r') as file:
      online_cpus = file.read().strip()
      file.close()
      # example online_cpus:
      # 0-2,3,4,5,6-8,10
      # 0-15
      # 0-1,3-15
      parts = online_cpus.split(',')

      result = []
      for part in parts:
        if '-' in part:
          # Handle range
          start, end = map(int, part.split('-'))
          result.extend(range(start, end + 1))
        else:
          # Handle single value
          result.append(int(part))
      return result
  except Exception as e:
    decky_plugin.logger.error(f'{__name__} error while getting online_cpus {e}')

  # cpu 0 is always online
  return [0]
