import os
from time import sleep
import decky_plugin
import advanced_options
import file_timeout
from enum import Enum
import cpu_utils

def write_command(command, paths):
  with file_timeout.time_limit(2):
    for p in paths:
      try:
        with open(p, 'w') as file:
          file.write(f'{command}')
          file.close()
      except OSError as e:
        if e.errno == 16:
          # Handle the [Errno 16] Device or resource busy error
          decky_plugin.logger.error(f'Error: {str(e)}. The device or resource is busy.')
        continue
      except Exception as e:
        decky_plugin.logger.error(e)
        continue
