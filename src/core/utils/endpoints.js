// export class Endpoints {
//   // static devUrl = "http://localhost:3000";
//     static devUrl = "http://127.0.0.1:8000";
//   // static prodUrl = "https://well-nest-back.vercel.app";
//   static baseUrl = Endpoints.devUrl;
//   static admin = `admin`;
//   static teachers = `teachers`;
//   static students = `students`;
//   static attendance = `attendance`;
//   // static adminchedule = 'calendar';
//   static login = `auth/login`;
//   static me = `login`;
// }

export class Endpoints {
  static devUrl = "http://127.0.0.1:8000/api";
  static baseUrl = Endpoints.devUrl;

  static login = `${Endpoints.baseUrl}/login`;  
  // static me = `${Endpoints.baseUrl}/user`;   
  
  static admin = `${Endpoints.baseUrl}/admin`;
  static teachers = `${Endpoints.baseUrl}/teachers`;
  static students = `${Endpoints.baseUrl}/students`;
  static attendance = `${Endpoints.baseUrl}/attendance`;
  static classroom = `${Endpoints.baseUrl}/classroom`;
  static subject = `${Endpoints.baseUrl}/subject`;


}
