import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/UserPage';
import SupplierPage from './pages/supplier/SupplierPage';
import OrderPage from './pages/order/OrderPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/product/ProductsPage';
import SupplierProductsPage from './pages/supplier_product/SupplierProductPage';
import SupplierProductDetailPage from './pages/supplier_product/SupplierProductDetail';
import CreateProductPage from './pages/product/CreateProductPage';
import UpdateProductPage from './pages/product/UpdateProductPage';
import ForecastProductPage from './pages/product/ForecastProductPage';
import PurchaseOrderPage from './pages/purchase_order/PurchaseOrderPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: <Navigate to="login" />,
      index: true,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/user" />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'supplier', element: <SupplierPage/>},
        { path: 'products', element: <ProductsPage /> },
        { path: 'orders', element: <OrderPage /> },
        { path: 'purchaseOrders', element: <PurchaseOrderPage /> },
        { path: 'supplierProducts', element: <SupplierProductsPage /> },
        { path: 'supplierProducts/detail', element: <SupplierProductDetailPage /> },
        { path: 'products/create', element: <CreateProductPage /> },
        { path: 'products/update', element: <UpdateProductPage /> },
        { path: 'products/forecast', element: <ForecastProductPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
