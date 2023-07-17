import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import SupplierProductCard from './SupplierProductCard';

SupplierProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function SupplierProductList({ products, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={3}>
          <SupplierProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
