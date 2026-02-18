# 📧 הגדרת שליחת מיילים

## צעדים להגדרה עם Gmail:

### 1. הפוך את חשבון Gmail שלך למאומת בשתי רמות:
   - היכנס ל: https://myaccount.google.com/security
   - הקלק על "2-Step Verification"
   - עקוב אחר ההוראות

### 2. ייצור App Password:
   - היכנס ל: https://myaccount.google.com/apppasswords
   - בחר: Mail ו- Windows Computer (או מה שרלוונטי)
   - Google יתן לך סיסמה בן 16 תווים
   - **העתק את הסיסמה הזו בדיוק**

### 3. ערוך את Server/.env:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxxxxxxxxxxxx
```

### 4. שמור את הקובץ וריסטרט את ה-server

---

## מה שקרה עכשיו:

✅ **Nodemailer** התקין - library לשליחת מיילים
✅ **email-service.js** נוצר - handles כל לוגיקת המיילים
✅ **order-controller.js** עודכן - שולח מייל אחרי כל הזמנה
✅ **Server.js** עודכן - טוען משתני environment

---

## מה קורה בזרימת ההזמנה:

1. לקוח שולח הזמנה
2. Server יוצר numeric ID להזמנה
3. Server שומר את ההזמנה לDB
4. **Server שולח מייל אוטומטי ללקוח** ✉️
5. Server מחזיר את ההזמנה לפרונטאנד

---

## טיפול בשגיאות:

אם שליחת המייל נכשלת:
- המייל לא יגרום להזמנה להיכשל ❌
- ההזמנה תישמר בכל מקרה ✓
- השגיאה תודפס לקונסול כדי לאתר בעיות 🔧

---

## צעדים הבאים (אופציונלי):

- שדר את ה-email בתבנית יותר יפה (HTML responsive)
- שלח מייל גם למנהל המערכת כשיש הזמנה חדשה
- הוסף tracking link להזמנה
- שנה את ה-email provider (Sendgrid, Mailgun, וכו)
