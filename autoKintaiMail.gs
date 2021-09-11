// 勤怠メール自動送信
//  機能1)次週予定作成
//       cIDで指定されたカレンダーから勤怠情報を取得する
//       終日設定でで先頭に「★」が付いているスケジュールを「勤怠予定」として月曜～日曜で自動生成する
//       カレンダーに登録がない場合、getCalendar関数の定数で指定したデフォルトのスケジュールをセットする
//  機能2)休暇予定作成
//       次週分を除く未来日の終日設定で先頭に「★」が付いているスケジュールを「休暇予定」として30日後まで自動生成する
//       終日で先頭に「★」が付いているスケジュールを翌月曜から日曜日をセットとしてメールで送信する
//  機能3)その他
//       日付判断はすべて自動化されているので考慮不要
//       休祝日判断は曜日とGooleカレンダーを参照
function SendKintai() {

  const cId = 'xxxx.xxxx@gmail.com'; //参照するカレンダー
  const sjh = '【勤怠】';
  const head = "来週以降の勤怠です。\n\n【勤怠予定】";
  const head2 = "\n\n【休暇予定】";

  const sdt = new Date(getNextWeekSt());
  const dt = new Date(getNextWeekSt());
  const to = 'xxxx.xxxx@gmail.com';
  const cc = '';
  const bcc = '';
  const yd = 30;

  let sjd = null;
  let cal = null

  // メール件名
  sdt.setDate(sdt.getDate() + 1);
  sjd = sdt;
  sj = sjh + Utilities.formatDate(sjd, 'Asia/Tokyo', 'yyyy/MM/dd') + '週';

  // 月曜日～日曜日の1週間の勤怠取得
  Logger.log('翌週予定作成開始');
  cal = head;
  for(let i = 0; i < 7; i++) {
    dt.setDate(dt.getDate() + 1);
    let d2 = dt;
    cal = cal + "\n" + getCalendar(d2,cId,1);
  }
  Logger.log('翌週予定作成終了');

  // 30日後までの予定作成
  Logger.log('休暇予定作成開始');
  cal = cal + head2;
  for(let i = 0; i < yd; i++) {
    dt.setDate(dt.getDate() + 1);
    let d2 = dt;
    if(getCalendar(d2,cId,2) != null){
      cal = cal + "\n" + getCalendar(d2,cId,2);
    }
  }

  Logger.log('休暇予定作成終了');

  Logger.log("【メール本文】\n\n" + cal);
  //メール送信
  sendMail(to, cc, bcc, sj,'', cal);
}

// 翌週の開始日（日曜日）取得
function getNextWeekSt(){
  let date = new Date();
  i=0;
  while(true){
    if(date.getDay() == 0){
      break;
    }
    date.setDate(date.getDate() + 1);
  }

  //Logger.log(Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd'));
  return Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd');
}

// 土日祝日判定
function isHoliday(day){
  //土日判定
  let weekInt = day.getDay();
  if(weekInt <= 0 || 6 <= weekInt){
    return true;
  }

  //祝日判定
  let calendarId = "ja.japanese#holiday@group.v.calendar.google.com"; //Googleカレンダーで判定
  let calendar = CalendarApp.getCalendarById(calendarId);
  let holidayEvents = calendar.getEventsForDay(day);
  if(holidayEvents.length > 0){
    return true;
  }

  return false;
}

// 曜日名生成
function getyb(nm){
  let str = "";

  if(nm == 0){
    str = '（日）';
  }else if(nm == 1){
    str = '（月）';
  }else if(nm == 2){
    str = '（火）';
  }else if(nm == 3){
    str = '（水）';
  }else if(nm == 4){
    str = '（木）';
  }else if(nm == 5){
    str = '（金）';
  }else if(nm == 6){
    str = '（土）';
  }else{
    str = 'N/A'
  }
  return str;
}

// カレンダーから勤怠取得
function getCalendar(day,cId,mode){

  const time = "09:00～18:00 ";
  const defKintai = 'テレワーク'; // 勤怠未入力の場合のデフォルト（平日）
  const defHoliday = '休み'; // 勤怠未入力の場合のデフォルト（土日祝日）

  let myCals=CalendarApp.getCalendarById(cId); //特定のIDのカレンダーを取得
  let events=myCals.getEventsForDay(new Date(day));　//カレンダーの本日のイベントを取得
  let cal = null;

  //Logger.log(new Date(day));

  d = Utilities.formatDate(day, 'Asia/Tokyo', 'yyyy/MM/dd')

  // 翌週のカレンダーを取得
  for (var i in events) {
    if(events[i].isAllDayEvent()){ // 終日判断
      if(events[i].getTitle().substring(0, 1) == "★"){ // ★判断
        cal = d + getyb(day.getDay()) + events[i].getTitle().substring(1);
      }
    }
  }
  if(cal == null){
    if(mode == 1 ){
      cal = d + getyb(day.getDay()) + time + defKintai;
      if(isHoliday(day)){
        cal = d + getyb(day.getDay()) + defHoliday;
      }
    }else{
      cal = null;
    }
  }
  if(typeof cal === "undefined") {
    if(mode == 1 ){
      cal = d + getyb(day.getDay()) + time + defKintai;
      if(isHoliday(day)){
        cal = d + getyb(day.getDay()) + defHoliday;
      }
    }else{
      cal = null;
    }
  }
  return cal;
}

// メール送信
function sendMail(tAddr,cAddr,bAddr,subject,name,body){
  MailApp.sendEmail({to:tAddr, cc:cAddr, bcc:bAddr, subject:subject, name:name, body:body});
}