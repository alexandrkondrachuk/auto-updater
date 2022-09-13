const languages = ['en', 'ru', 'uk'];
const messages = {
    en: {
        'Update is available': 'Update is available',
        'Now application will start updating and restart.': 'Now application will start updating and restart.',
        'Ok': 'Ok',
        'Later': 'Later',
        'There was a problem updating the application': 'There was a problem updating the application',
    },
    ru: {
        'Update is available': 'Доступно обновление',
        'Now application will start updating and restart.': 'Сейчас будет произведено обновление и перезапуск приложения.',
        'Ok': 'Ок',
        'Later': 'Позже',
        'There was a problem updating the application': 'Возникла проблема с обновлением приложения',
    },
    uk: {
        'Update is available': 'Доступне оновлення',
        'Now application will start updating and restart.': 'Зараз буде виконано оновлення та перезавантаження додатку.',
        'Ok': 'Ок',
        'Later': 'Пiзнiше',
        'There was a problem updating the application': 'Під час оновлення програми виникла проблема',
    },
};

const t = (translation = '', lang = 'en') => messages[lang][translation];

module.exports = {
    languages,
    messages,
    t,
};