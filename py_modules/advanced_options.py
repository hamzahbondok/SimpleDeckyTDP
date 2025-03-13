import os
import shutil
import subprocess
import decky_plugin
from plugin_settings import get_nested_setting
from enum import Enum
import device_utils


class AdvancedOptionsType(Enum):
  BOOLEAN = 'boolean'
  NUMBER_RANGE = 'number_range'


class DefaultSettings(Enum):
  ENABLE_TDP_CONTROL = 'enableTdpControl'
  AC_POWER_PROFILES = 'acPowerProfiles'


def get_setting(setting_name = ''):
  return get_nested_setting(f'advanced.{setting_name}')

def get_value(setting, default_value = False):
  current_val = get_nested_setting(
    f'advanced.{setting.value}'
  )

  if isinstance(current_val, bool):
    return current_val
  else:
    return default_value

def get_number_value(setting, default_value):
  current_val = get_nested_setting(
    f'advanced.{setting.value}'
  )

  if isinstance(current_val, int):
    return current_val
  else:
    return default_value

def get_default_options():
  options = []

  # enable_steam_patch = {
  #   'name': 'Fix Steam Hardware Controls (Experimental)',
  #   'type': AdvancedOptionsType.BOOLEAN.value,
  #   'defaultValue': False,
  #   'description': 'Fixes Steam TDP Slider (and GPU Slider on some distros). Note, cannot be used with per-game AC profiles',
  #   'currentValue': get_value(DefaultSettings.ENABLE_STEAM_PATCH),
  #   'statePath': DefaultSettings.ENABLE_STEAM_PATCH.value
  # }

  # options.append(enable_steam_patch)

  enable_tdp_control = {
    'name': 'Enable TDP Controls',
    'type': AdvancedOptionsType.BOOLEAN.value,
    'defaultValue': True,
    'description': 'Enables TDP Sliders, and other advanced options',
    'currentValue': get_value(DefaultSettings.ENABLE_TDP_CONTROL, True),
    'statePath': DefaultSettings.ENABLE_TDP_CONTROL.value
  }

  options.append(enable_tdp_control)

  ac_power_profiles = {
    'name': 'Enable per-game AC power TDP profiles',
    'type': AdvancedOptionsType.BOOLEAN.value,
    'defaultValue': False,
    'description': 'When plugged into AC power, use a separate per-game TDP profile. Per-game profiles must be enabled',
    'currentValue': get_value(DefaultSettings.AC_POWER_PROFILES, False),
    'statePath': DefaultSettings.AC_POWER_PROFILES.value
  }

  options.append(ac_power_profiles)

  return options


def get_advanced_options():
  options = get_default_options()

  return options

def tdp_control_enabled():
  return get_setting(DefaultSettings.ENABLE_TDP_CONTROL.value)
