import { Helmet } from 'react-helmet-async';
import { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Container, Stack, Typography, Button, TextField } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../../sections/@dashboard/products';
import axios from '../../data/httpCommon';

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const  [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/products?page=0&size=50")
      .then((response) => {
        setProducts(response.data.data);
      } );
  }, []);

  const searchProduct = (event) => {
    axios
      .get(`/api/products/search?keyword=${event.target.value}`)
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" >
          <Typography variant="h4" sx={{ mb: 5 }}>
            Danh sách sản phẩm
          </Typography>
          <Button variant="contained" sx={{ mb: 5 }} onClick={() => {
                navigate('/dashboard/products/create',);
          }} >Tạo sản phẩm mới</Button>
        </Stack>
        <TextField id="outlined-basic" fullWidth label="Tìm kiếm sản phẩm" variant="outlined" onChange={(e) => {
          searchProduct(e);
        }}/>
        <div style={{height : 16}}/>
        <ProductList products={products} />
      </Container>
    </>
  );
}
