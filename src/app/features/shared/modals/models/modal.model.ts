export interface ModalData {
  header: string;
  header2?: string;
  headerAlign?: string;
  alert?: {
    type: string;
    icon: string;
    size?: string;
  };
  modalSize?: string;
  bodyContent: any;
  onClose: () => void;
  callsToAction: Array<CtaModel>;
}

export interface CtaModel {
  label: string;
  HtmlElementType: 'a' | 'button';
  buttonAlign?: 'left' | 'center' | 'right';
  linkAlign?: 'left' | 'center' | 'right';
  action: () => void;
}
