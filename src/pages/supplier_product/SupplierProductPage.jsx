import { Helmet } from 'react-helmet-async';
import { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Container, Stack, Typography, Button, Box } from '@mui/material';
// components
import {SupplierProductList } from '../../sections/@dashboard/products';
import axios from '../../data/httpCommon';

export default function SupplierProductPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const  [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/supplier-products/all")
      .then((response) => {
        setProducts(response.data.data);
        console.log(response.data.data);
      } );
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard: Products </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" >
          <Typography variant="h4" sx={{ mb: 5 }}>
            Danh sách sản phẩm của nhà cung cấp
          </Typography>
        </Stack>
        <SupplierProductList products={products} />
      </Container>
    </>
  );
}
