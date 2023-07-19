import PropTypes from 'prop-types';
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {formatImageUrl} from '../../../utils/formatUrl';
import {formatCurrency} from "../../../utils/formatNumber";

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

  const { name, price, images } = product;
  const handleClick = () => {
    navigate('/dashboard/products/update', {
      state: { product },
    });
  };

  return (
    <Card onClick={handleClick}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledProductImg alt={name} src={formatImageUrl(images[0])} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">{formatCurrency(price)}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
