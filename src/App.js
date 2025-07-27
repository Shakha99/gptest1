import React, { useState, useEffect } from 'react';
import { useRawInitData } from '@telegram-apps/sdk-react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const API_URL = 'https://backend-repo-f9q0.onrender.com'; // Новый URL бэкенда

function App() {
  const initDataRaw = useRawInitData();
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [product] = useState({ name: 'Example Product', price: 1000, discounted: 500 });

  useEffect(() => {
    if (initDataRaw) {
      axios.post(`${API_URL}/api/auth`, { initData: initDataRaw }).then(res => setUser(res.data.user));
    }
  }, [initDataRaw]);

  const handleParticipate = (ref) => {
    axios.post(`${API_URL}/api/participate`, { tg_id: user.tg_id, ref_code: ref }).then(res => {
      setGroup(res.data);
      setTimeLeft(res.data.timeLeft / 1000);
    });
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (group) {
      axios.get(`${API_URL}/api/group/${group.groupId}`).then(res => setGroup(res.data));
    }
  }, [timeLeft, group]);

  const handleInvite = () => {
    axios.get(`${API_URL}/api/invites/${user.tg_id}`).then(res => {
      window.Telegram.WebApp.openTelegramLink(res.data.links[0]);
    });
  };

  const handlePay = (provider) => {
    axios.post(`${API_URL}/api/payment/init`, { group_id: group.groupId, user_tg_id: user.tg_id, provider }).then(res => {
      window.Telegram.WebApp.openLink(res.data.payment_url);
    });
  };

  const switchLang = () => {
    const newLang = i18n.language === 'ru' ? 'uz' : 'ru';
    i18n.changeLanguage(newLang);
    axios.post(`${API_URL}/api/language`, { tg_id: user.tg_id, lang: newLang });
  };

  if (!user) return <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-indigo-600 p-4 text-white">
      <button onClick={switchLang} className="absolute top-4 right-4 bg-white text-black px-2 py-1 rounded">{t('lang_switch')}</button>
      <h1 className="text-2xl font-bold mb-4">{t('product')}: {product.name}</h1>
      <p>Цена: {product.price}, Скидка: {product.discounted}</p>
      {!group ? (
        <button onClick={() => handleParticipate(window.location.search.split('ref_')[1])} className="bg-green-500 px-4 py-2 rounded mt-4">{t('participate')}</button>
      ) : (
        <>
          <div className="text-xl mb-4">{t('timer', { time: dayjs.duration(timeLeft, 'seconds').humanize() })}</div>
          <button onClick={handleInvite} className="bg-blue-500 px-4 py-2 rounded mr-2">{t('invite')}</button>
          <button onClick={() => handlePay('payme')} className="bg-yellow-500 px-4 py-2 rounded mr-2">Payme</button>
          <button onClick={() => handlePay('click')} className="bg-red-500 px-4 py-2 rounded">Click</button>
          {group.status === 'completed' && <p className="mt-4 text-green-300">{t('group_complete')}</p>}
          {group.status === 'failed' && <p className="mt-4 text-red-300">{t('group_failed')}</p>}
        </>
      )}
    </div>
  );
}

export default App;