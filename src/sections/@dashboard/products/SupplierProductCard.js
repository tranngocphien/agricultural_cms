import PropTypes from 'prop-types';
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {formatImageUrl} from '../../../utils/formatUrl';

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

SupplierProductCard.propTypes = {
  product: PropTypes.object,
};

export default function SupplierProductCard({ product }) {
  const navigate = useNavigate();
  console.log(product);

  const { productName, expectedPrice, images } = product;
  const handleClick = () => {
    navigate('/dashboard/supplierProducts/detail', {
      state: { product },
    });
  };

  return (
    <Card onClick={handleClick}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledProductImg alt={productName} src={formatImageUrl(images[0])} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {productName}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">{expectedPrice}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
