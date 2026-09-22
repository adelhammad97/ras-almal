# المرحلة الثالثة: الخادم الحقيقي

تم ربط أساس اللعبة بالخادم وقاعدة البيانات:

- `/auth`: تسجيل وإنشاء حساب.
- `/api/profile`: قراءة وتعديل الملف الشخصي.
- `/api/wallet`: قراءة المحفظة والحسابات والسجل المالي.
- `/api/wallet/transfer`: تحويلات حقيقية داخل Prisma transaction مع رسوم.
- `/api/market/orders`: أوامر سوق فورية أو محددة، وتحديث holdings والمحفظة والسجل.
- `/api/companies`: إنشاء وعرض شركات اللاعب.
- `/api/admin/players`: قائمة اللاعبين للمشرفين.
- `/api/admin/players/access`: حظر/فك حظر وتعديل الصلاحيات مع audit log.

التشغيل:

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

قبل الإنتاج يجب إضافة PostgreSQL، حماية CSRF، تحديد معدل الطلبات، مزود OAuth رسمي لـ Google، خدمة SMS موثوقة، واختبارات تكامل. لا تعتبر أرصدة SQLite المحلية أموالًا حقيقية.
