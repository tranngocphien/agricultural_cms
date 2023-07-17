// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: icon('ic_product'),
  },
  {
    title: 'supplier product',
    path: '/dashboard/supplierProducts',
    icon: icon('ic_supplier_product'),
  },
  {
    title: 'Đơn đặt hàng',
    path: '/dashboard/orders',
    icon: icon('ic_order'),
  },
  {
    title: 'Đơn mua hàng',
    path: '/dashboard/purchaseOrders',
    icon: icon('ic_purchase_order'),
  },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
