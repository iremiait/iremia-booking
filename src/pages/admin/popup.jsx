import React from 'react';
import PopupDashboard from '../../components/admin/PopupDashboard';

// Pagina admin per la gestione dei popup
export default function AdminPopupPage() {
  return <PopupDashboard />;
}

// Se vuoi proteggere la pagina con autenticazione, aggiungi:
// export async function getServerSideProps(context) {
//   // Qui puoi aggiungere controllo autenticazione
//   // Per esempio con Supabase:
//   // const { data: { session } } = await supabase.auth.getSession()
//   // if (!session) {
//   //   return {
//   //     redirect: {
//   //       destination: '/login',
//   //       permanent: false,
//   //     },
//   //   }
//   // }
//   
//   return {
//     props: {},
//   }
// }
