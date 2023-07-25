import PropTypes from 'prop-types';
import { Box, Card, Link, Button, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Label from '../../../components/label';
import { formatImageUrl } from '../../../utils/formatUrl';
import { formatCurrency } from '../../../utils/formatNumber';

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const navigate = useNavigate();

  const { name, price, images, stock, sku } = product;
  const handleClick = () => {
    navigate('/dashboard/products/update', {
      state: { product },
    });
  };

  const handleForecast = () => {
    navigate('/dashboard/products/forecast', {
      state: { product },
    });
  };

  return (
    <Stack spacing={2}>
      <Card onClick={handleClick}>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          <StyledProductImg alt={name} src={formatImageUrl(images[0])} />
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Link color="inherit" underline="hover">
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
            <Label color="info">{`${stock} ${sku}`}</Label>
          </Link>

          <Stack direction="row" alignItems="center" justifyContent="space-between" alignContent="center">
            <Typography variant="subtitle1">{formatCurrency(price)}</Typography>
          </Stack>
        </Stack>
      </Card>
      <Button variant="contained" onClick={handleForecast}>
        Dự báo
      </Button>
    </Stack>
  );
}
