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
            height="200"
            image={product.imageUrl}
            alt={product.name}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          // Hiển thị placeholder nếu không có hình ảnh
          <Box 
            sx={{ 
              height: 200, 
              backgroundColor: '#f0f0f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            <NoImageIcon sx={{ fontSize: 80, color: '#bdbdbd' }} />
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2
          }}>
            {product.description || 'High quality product with excellent features.'}
          </Typography>
          <Typography variant="h6" color="primary">
            ${product.unitPrice}
          </Typography>
          <Typography variant="caption" color={product.quantity > 0 ? "success.main" : "error.main"}>
            {product.quantity > 0 ? `In Stock: ${product.quantity}` : "Out of Stock"}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button 
          size="small" 
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => onAddToCart(product)}
          disabled={product.quantity <= 0}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;