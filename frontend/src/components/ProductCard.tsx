import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Box from '@mui/material/Box';
import NoImageIcon from '@mui/icons-material/Image';
import { useMediaQuery, useTheme } from '@mui/material';

interface Product {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Kiểm tra xem có imageUrl hay không
  const hasImage = Boolean(product.imageUrl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{ 
      maxWidth: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 20px -10px rgba(0,0,0,0.2)'
      }
    }}>
      <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {hasImage ? (
          // Hiển thị hình ảnh nếu có
          <CardMedia
            component="img"
            height={isMobile ? "150" : "200"}
            image={product.imageUrl}
            alt={product.name}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          // Hiển thị placeholder nếu không có hình ảnh
          <Box 
            sx={{ 
              height: isMobile ? 150 : 200, 
              backgroundColor: '#f0f0f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            <NoImageIcon sx={{ fontSize: isMobile ? 60 : 80, color: '#bdbdbd' }} />
          </Box>
        )}
        <CardContent sx={{ 
          flexGrow: 1, 
          p: isMobile ? 1.5 : 2,
          '&:last-child': { 
            paddingBottom: isMobile ? 1.5 : 2 
          }
        }}>
          <Typography 
            gutterBottom 
            variant={isMobile ? "subtitle1" : "h6"} 
            component="div" 
            noWrap
            sx={{
              fontSize: isMobile ? '0.95rem' : undefined,
              fontWeight: 'bold'
            }}
          >
            {product.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              mb: 2,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              lineHeight: isMobile ? '1.3' : '1.43'
            }}
          >
            {product.description || 'High quality product with excellent features.'}
          </Typography>
          <Typography 
            variant={isMobile ? "subtitle2" : "h6"} 
            color="primary"
            sx={{
              fontSize: isMobile ? '1rem' : undefined,
              fontWeight: 'bold'
            }}
          >
            ${product.unitPrice}
          </Typography>
          <Typography 
            variant="caption" 
            color={product.quantity > 0 ? "success.main" : "error.main"}
            sx={{ 
              display: 'block',
              fontSize: isMobile ? '0.7rem' : '0.75rem',
              mt: 0.5
            }}
          >
            {product.quantity > 0 ? `In Stock: ${product.quantity}` : "Out of Stock"}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ padding: isMobile ? 1 : 1.5 }}>
        <Button 
          size={isMobile ? "small" : "medium"} 
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCartIcon fontSize={isMobile ? "small" : "medium"} />}
          onClick={() => onAddToCart(product)}
          disabled={product.quantity <= 0}
          sx={{
            py: isMobile ? 0.5 : 0.75,
            fontSize: isMobile ? '0.75rem' : undefined
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;