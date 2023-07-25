import { styled } from '@mui/material/styles';
import { Card, Box, Link, Typography, Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../data/httpCommon';
import Label from '../../components/label';
import { formatImageUrl } from '../../utils/formatUrl';
import { formatCurrency } from '../../utils/formatNumber';

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

export default function ForecastProductPage() {
  const [monthlyForecast, setMonthlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);

  const location = useLocation();
  const product = location.state.product;
  const { id, name, price, images, stock, sku } = product;

  useEffect(() => {
    axios.get(`/api/admin/monthlySales/${id}`).then((response) => {
        setMonthlyForecast(response.data.data);
    });
    axios.get(`/api/admin/dailySales/${id}`).then((response) => {
        setDailyForecast(response.data.data);
      });
  }, []);

  console.log(product);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" gutterBottom>
        Dự báo doanh số sản phẩm
      </Typography>
      <Stack direction="row" spacing={2}>
        <Card>
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
        <Stack spacing={2} width={400}>
          <Label color="info">Theo tháng</Label>
          {monthlyForecast.map((item) => (
            <Stack direction="row" spacing={3}>
              <Label>{item.date}</Label>
              <Typography>{item.value}</Typography>
            </Stack>
          ))}
        </Stack>

        <Stack spacing={2} width={400}>
          <Label color="info">Theo ngày</Label>
          {dailyForecast.map((item) => (
            <Stack direction="row" spacing={3}>
              <Label>{item.date}</Label>
              <Typography>{item.value}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
