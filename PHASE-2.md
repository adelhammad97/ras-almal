# تطوير المرحلة الحالية

تم إصلاح بنية Next.js الأساسية وإضافة طبقة بيانات أولية للإدارة والأمان.

## تشغيل محلي

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run dev
```

- `/dashboard` لوحة اللاعب.
- `/admin` لوحة الإدارة.
- `/features` كتالوج المزايا.
- `/admin/features` التحكم بالمزايا.
- `/api/features` حالة المزايا بصيغة JSON.

هذه المرحلة ما زالت Prototype: المعاملات داخل واجهة اللاعب محلية، أما Prisma فأصبح جاهزًا للانتقال إلى حسابات متعددة اللاعبين في المرحلة التالية.
