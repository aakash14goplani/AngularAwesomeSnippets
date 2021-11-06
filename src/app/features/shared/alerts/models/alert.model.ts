export interface AlertData {
  header: string;
  headerAlign: 'left' | 'center' | 'right';
  alertType: 'info' | 'success' | 'danger' | 'warning' | 'page-message';
  bodyContent: string;
}
