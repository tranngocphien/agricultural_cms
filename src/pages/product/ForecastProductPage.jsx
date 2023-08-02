import { styled } from '@mui/material/styles';
import { Card, Box, Link, Typography, Stack } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
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

  const [monthlyLabel, setMonthlyLabel] = useState([]);
  const [monthlyValue, setMonthlyValue] = useState([]);

  const [dailyLabel, setDailyLabel] = useState([]);
  const [dailyValue, setDailyValue] = useState([]);

  const location = useLocation();
  const product = location.state.product;
  const { id, name, price, images, stock, sku } = product;

  useEffect(() => {
    axios.get(`/api/admin/monthlySales/${id}`).then((response) => {
      setMonthlyForecast(response.data.data);
      const labels = response.data.data.map((item) => item.date);
      setMonthlyLabel(labels);
      console.log(labels);
      const values = response.data.data.map((item) => Number(item.value));
      setMonthlyValue(values);
      console.log(values);
    });
    axios.get(`/api/admin/dailySales/${id}`).then((response) => {
      setDailyForecast(response.data.data);
      const labels = response.data.data.map((item) => item.date);
      setDailyLabel(labels);
      console.log(labels);
      const values = response.data.data.map((item) => Number(item.value));
      setDailyValue(values);
      console.log(values);
    });
  }, []);

  console.log(product);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" gutterBottom>
        Dự báo doanh số sản phẩm
      </Typography>
      <Stack spacing={2}>
        <Card>
          <Box sx={{ position: 'relative' }}>
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
          {/* {monthlyForecast.map((item) => (
            <Stack direction="row" spacing={3}>
              <Label>{item.date}</Label>
              <Typography>{item.value}</Typography>
            </Stack>
          ))} */}
        </Stack>

        {monthlyValue.length > 0 && monthlyLabel.length > 0 && (
          <LineChart
            width={60*(monthlyValue.length)}
            height={300}
            series={[{ type: 'line', data: monthlyValue }]}
            xAxis={[{ scaleType: 'point', data: monthlyLabel }]}
          />
        )}

        <Stack spacing={2} width={400}>
          <Label color="info">Theo ngày</Label>
          {/* {dailyForecast.map((item) => (
            <Stack direction="row" spacing={3}>
              <Label>{item.date}</Label>
              <Typography>{item.value}</Typography>
            </Stack>
          ))} */}
        </Stack>

        {dailyValue.length > 0 && dailyLabel.length > 0 && (
          <LineChart
            width={50*(dailyValue.length)}
            height={300}
            series={[{ type: 'line', data: dailyValue }]}
            xAxis={[{ scaleType: 'point', data: dailyLabel }]}
          />
        )}
      </Stack>
    </Stack>
  );
}
