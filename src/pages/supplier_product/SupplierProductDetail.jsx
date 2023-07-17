import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Stack, Typography, Button, Box, ImageList, ImageListItem } from '@mui/material';
import Iconify from '../../components/iconify';
import axios from '../../data/httpCommon';
import { formatImageUrl } from '../../utils/formatUrl';
import Label from '../../components/label';

export default function SupplierProductDetailPage() {
  const location = useLocation();
  const product = location.state.product;
  console.log(product);
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Thông tin sản phẩm
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Đặt mua sản phẩm
          </Button>
        </Stack>
        <Stack direction="row" spacing={4}>
          <Box sx={{ width: 500, height: 500, border: '1px dashed grey', borderRadius: 4, padding: 2 }}>
            <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
              {product.images.map((item) => (
                <ImageListItem key={item.img}>
                  <img src={formatImageUrl(item)} alt={product.productName} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>

          <Stack direction="column" spacing={4}>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Tên sản phẩm
              </Typography>
              <Typography variant="body1" width={200}>
                {product.productName}
              </Typography>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Nguồn gốc xuất xứ
              </Typography>
              <Typography variant="body1" width={200}>
                {product.location}
              </Typography>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Giá mong muốn
              </Typography>
              <Typography variant="body1" width={200}>
                {`${product.expectedPrice}/${product.sku}`}
              </Typography>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Mô tả sản phẩm
              </Typography>
              <Typography variant="body1" width={200}>
                {product.description}
              </Typography>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Cách bảo quản
              </Typography>
              <Typography variant="body1" width={200}>
                {product.preservation}
              </Typography>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Loại sản phẩm
              </Typography>
              <Label color = "success" >{`${product.category.categoryName}`}</Label>
            </Stack>
            <Stack direction="row" alignContent="baseline">
              <Typography variant="subtitle2" width={200}>
                Hình ảnh chứng nhận sản phẩm
              </Typography>
              <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                {product.certificateImages.map((item) => (
                  <ImageListItem key={item}>
                    <img src={formatImageUrl(item)} alt={product.productName} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
