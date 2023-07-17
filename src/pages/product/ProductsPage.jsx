import { Helmet } from 'react-helmet-async';
import { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Container, Stack, Typography, Button, Box } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../../sections/@dashboard/products';
import axios from '../../data/httpCommon';

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const  [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/products")
      .then((response) => {
        setProducts(response.data.data);
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
            Products
          </Typography>
          <Button variant="contained" sx={{ mb: 5 }} onClick={() => {
                navigate('/dashboard/products/create',);
          }} >Create New Product</Button>
        </Stack>
        <ProductList products={products} />
      </Container>
    </>
  );
}
