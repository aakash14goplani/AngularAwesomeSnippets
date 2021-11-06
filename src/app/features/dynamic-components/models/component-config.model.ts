import { AlertData } from '../../shared/alerts/models/alert.model';
import { ModalData } from '../../shared/modals/models/modal.model';

export interface ComponentConfig {
  componentType: 'modal' | 'alert';
  dynamicComponentType: any;
  data: ModalData | AlertData;
}
