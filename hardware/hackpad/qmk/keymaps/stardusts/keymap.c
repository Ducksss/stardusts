#include QMK_KEYBOARD_H

enum layers {
  _BASE,
  _NAV,
};

enum custom_keycodes {
  SD_LOG = SAFE_RANGE,
  SD_SHIP,
};

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
  [_BASE] = LAYOUT(
    KC_ESC,  KC_TAB,  MO(_NAV), SD_LOG,
    KC_LCTL, KC_X,    SD_SHIP,  KC_ENT,
    KC_A,    KC_B,    KC_C,     KC_D
  ),
  [_NAV] = LAYOUT(
    KC_GRV,  KC_UP,   KC_HOME,  KC_PGUP,
    KC_LEFT, KC_DOWN, KC_RGHT,  KC_PGDN,
    KC_MUTE, KC_VOLD, KC_VOLU,  KC_END
  ),
};

bool process_record_user(uint16_t keycode, keyrecord_t *record) {
  if (!record->event.pressed) {
    return true;
  }

  switch (keycode) {
    case SD_LOG:
      SEND_STRING("devlog: ");
      return false;
    case SD_SHIP:
      SEND_STRING("npm test && npm run build");
      tap_code(KC_ENT);
      return false;
    default:
      return true;
  }
}

#ifdef ENCODER_MAP_ENABLE
const uint16_t PROGMEM encoder_map[][NUM_ENCODERS][2] = {
  [_BASE] = { ENCODER_CCW_CW(KC_VOLD, KC_VOLU) },
  [_NAV] = { ENCODER_CCW_CW(KC_LEFT, KC_RGHT) },
};
#endif
