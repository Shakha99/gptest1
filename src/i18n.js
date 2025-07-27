import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      product: 'Товар',
      participate: 'Участвовать',
      invite: 'Пригласить друзей',
      pay: 'Оплатить',
      timer: 'Осталось: {{time}}',
      group_complete: 'Группа собрана!',
      group_failed: 'Группа не собрана',
      lang_switch: 'Uz'
    }
  },
  uz: {
    translation: {
      product: 'Mahsulot',
      participate: 'Ishtirok etish',
      invite: 'Do\'stlarini taklif qilish',
      pay: 'To\'lov',
      timer: 'Qoldi: {{time}}',
      group_complete: 'Guruh yig\'ildi!',
      group_failed: 'Guruh yig\'ilmadi',
      lang_switch: 'Ru'
    }
  }
};

i18n.use(initReactI18next).init({ resources, lng: 'ru', interpolation: { escapeValue: false } });
export default i18n;