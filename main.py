import ac_power
import decky_plugin
import plugin_update
import time
import file_timeout
import advanced_options
import power_utils
import cpu_utils
import os
from plugin_settings import merge_tdp_profiles, get_saved_settings, get_tdp_profile, get_active_tdp_profile, per_game_profiles_enabled, set_setting as persist_setting
import plugin_utils
import steam_info

class Plugin:

  async def log_info(self, info):
    decky_plugin.logger.info(info)

  async def is_steam_running(self):
    return steam_info.is_steam_running()

  async def get_settings(self):
    try:
      settings = get_saved_settings()
      try:
        with file_timeout.time_limit(5):
          settings['advancedOptions'] = advanced_options.get_advanced_options()

          settings['supportsCustomAcPowerManagement'] = ac_power.supports_custom_ac_power_management()

      except Exception as e:
        decky_plugin.logger.error(f"main#get_settings failed to get info {e}")

      settings['pluginVersionNum'] = f'{decky_plugin.DECKY_PLUGIN_VERSION}'
      return settings
    except Exception as e:
      decky_plugin.logger.error(f"get_settings failed to get settings {e}")

  async def set_setting(self, name: str, value):
    try:
      if name == "advanced":
        advanced_options.handle_advanced_option_change(value)

      return persist_setting(name, value)
    except Exception as e:
      decky_plugin.logger.error(f"error failed to set_setting {name}={value} {e}")

  async def set_values_for_game_id(self, gameId):
    plugin_utils.set_values_for_game_id(gameId)

  
  async def persist_tdp(self, tdp, gameId):
    plugin_utils.persist_tdp(tdp, gameId)

  async def get_latest_version_num(self):
    return plugin_update.get_latest_version()

  async def save_tdp(self, tdpProfiles, currentGameId, advanced):
    try:
      merge_tdp_profiles(tdpProfiles)
      persist_setting('advanced', advanced)

      tdp_profile = get_active_tdp_profile(currentGameId)

      try:
        with file_timeout.time_limit(3):
          plugin_utils.set_values_for_tdp_profile(tdp_profile)
      except Exception as e:
        decky_plugin.logger.error(f'main#save_tdp file timeout {e}')

    except Exception as e:
      decky_plugin.logger.error(e)

  async def set_max_tdp(self):
    settings = get_saved_settings()
    max_tdp = settings.get('maxTdp')
    if (max_tdp and max_tdp > 10):
      cpu_utils.set_tdp(max_tdp)


  async def supports_custom_ac_power_management(self):
    return ac_power.supports_custom_ac_power_management()

  async def get_ac_power_status(self):
    ac_power_path = ac_power.custom_ac_power_management_path()

    if ac_power_path and os.path.exists(ac_power_path):
      with open(ac_power_path, 'r') as file:
        current_status = file.read().strip()
        file.close()
        return current_status
    return None

  # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
  async def _main(self):
    decky_plugin.logger.info("SimpleDeckyTDP Starting")

  # Function called first during the unload process, utilize this to handle your plugin being removed
  async def _unload(self):
    decky_plugin.logger.info("SimpleDeckyTDP Unloading")
    pass


