# حسنات (Hasanat) 🌙

موقع إسلامي متكامل مبني بتقنيات الويب الحديثة، يهدف إلى مساعدة المسلم في الحفاظ على ورده اليومي من الأذكار، متابعة الدروس العلمية، والحفاظ على عاداته اليوميه مع عدم تعارضها مع أوقات الصلاه بكل سهولة وسلاسة بفضل تجربة مستخدم عصرية وسريعة.

## رابط المعاينة (Live Preview) 🚀

**رابط المعاينة الحية (Live Demo):** [https://hasanat-is.pages.dev](https://hasanat-is.pages.dev)
## مميزات المشروع ✨
- **الأذكار اليومية:** قراءة أذكار الصباح والمساء مع عدّاد تفاعلي مدمج وحفظ تلقائي للتقدم.
- **الدروس العلمية (CMS):** نظام لإدارة السلاسل والدروس بالصوت، مع لوحة تحكم ذكية تتيح السحب والإفلات لترتيب الدروس.
- **مواقيت الصلاة:** جلب مواقيت الصلاة بدقة بناءً على موقع المستخدم الفعلي.
- **متتبع العادات (Habit Tracker):** نظام متكامل لحفظ ومتابعة العادات اليومية (مثل الصلوات الخمس والسنن) ويحفظ التقدم سحابياً.
- **نظام الحسابات والأمان (Firebase):** يمكن للمستخدم التسجيل باستخدام البريد الإلكتروني أو حساب **Google** لتزامن بياناته بين مختلف الأجهزة بأمان تام بفضل قوانين (Firestore Rules).
- **المفضلة وتحدي اليوم:** تحديات يومية متجددة، وإمكانية إضافة السلاسل والدروس للمفضلة للعودة إليها لاحقاً.
- **تصميم عصري (Glassmorphism):** واجهات مريحة للعين، تدعم الوضع الليلي والنهاري بانتقالات حركية سلسة عبر `Framer Motion`.

## التقنيات المستخدمة 🛠️
- **Frontend:** React.js, Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Backend/Database:** Firebase (Auth, Firestore)
- **Routing:** React Router DOM

## طريقة التشغيل محلياً 💻
1. تأكد من تثبيت `Node.js` في جهازك.
2. قم بتنزيل المشروع وافتح موجه الأوامر داخله.
3. قم بتثبيت الحزم المطلوبة:
   ```bash
   npm install
   ```
4. قم بتشغيل خادم التطوير:
   ```bash
   npm run dev
   ```
5. افتح الرابط الذي سيظهر لك في المتصفح `http://localhost:5173`.

## أدوات للمشرفين (Admin Tools) 🛠️
إذا كنت ترغب في استخراج قائمة تشغيل من يوتيوب لرفعها دفعة واحدة (Bulk Upload) في لوحة التحكم، يمكنك فتح قائمة التشغيل على يوتيوب، وفتح (Console) في المتصفح، ثم لصق الكود التالي:

```javascript
let container = document.querySelector('div.playlist-items.style-scope.ytd-playlist-panel-renderer');

if (!container) {
    console.log("الكونتينر مش ظاهر، تأكد إن قائمة الحلقات الجانبية مفتوحة.");
} else {
    let items = container.querySelectorAll('ytd-playlist-panel-video-renderer');
    let videos = [];

    items.forEach((item, index) => {
        let linkElement = item.querySelector('a#video-title') || item.querySelector('a');
        let titleElement = item.querySelector('#video-title');
        
        let title = titleElement ? titleElement.innerText.trim() : (linkElement ? linkElement.innerText.trim() : '');
        
        let url = '';
        if (linkElement) {
            url = linkElement.href || linkElement.getAttribute('href') || '';
        }
        
        if (url) {
            if (url.startsWith('/')) {
                url = 'https://www.youtube.com' + url;
            }
            url = url.split('&')[0]; 
        }
        
        if (title.length > 0) {
            videos.push({
                title: title,
                url: url
            });
        }
    });

    console.table(videos);
    console.log(JSON.stringify(videos, null, 2));
}
```
بعدها يمكنك نسخ مصفوفة JSON الناتجة ولصقها في حقل "إضافة مجموعة روابط" في لوحة التحكم.
