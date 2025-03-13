import decky_plugin
import file_timeout
from time import sleep
import advanced_options
from plugin_settings import bootstrap_profile, merge_tdp_profiles, get_tdp_profile, set_setting as persist_setting
from cpu_utils import set_tdp
import power_utils


def set_values_for_game_id(game_id):
  tdp_profile = get_tdp_profile(game_id)
  if tdp_profile:
    set_values_for_tdp_profile(tdp_profile)

def set_values_for_tdp_profile(tdp_profile, set_tdp = True):
  if set_tdp:
    set_tdp_for_tdp_profile(tdp_profile)

  profile = tdp_profile

  profile = power_utils.DEFAULT_CPU_PROFILE

def set_tdp_for_tdp_profile(tdp_profile):
  if tdp_profile.get('tdp'):
    try:
      with file_timeout.time_limit(3):
        set_tdp(tdp_profile.get('tdp'))
    except Exception as e:
      decky_plugin.logger.error(f'main#set_tdp_for_tdp_profile timeout {e}')

def persist_tdp(tdp, game_id):
  bootstrap_profile(game_id)
  tdp_profile = {
    f"{game_id}": {
      "tdp": tdp
    }
  }
  merge_tdp_profiles(tdp_profile)

  try:
    with file_timeout.time_limit(3):
      set_values_for_game_id(game_id)
  except Exception as e:
    decky_plugin.logger.error(f'main#set_steam_patch timeout {e}')

