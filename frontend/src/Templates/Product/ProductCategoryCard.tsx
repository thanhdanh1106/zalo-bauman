import { postCategoryProps } from '@shared/types/post';
import { getThumbnailUrl } from '@shared/utils/Hooks';
import { FaBeer } from 'react-icons/fa';
import { Link } from 'react-router-dom';

type Props = { category: postCategoryProps };

const ProductCategoryCard = (props: Props) => {
  const { category } = props;
  return (
    <Link
      key={category.id}
      to={`/products?category=${category.id}`}
      className="group relative overflow-hidden rounded-lg border border-[#eee] hover:border-[#cbb27c] transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden">
        {category.thumbnail && (
          <img
            src={getThumbnailUrl(category?.thumbnail)}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 aspect-[4/3] transition-transform duration-300"
          />
        )}
      </div>
      <div className="p-6 bg-gradient-to-t from-[#1a1d20] to-[#2a2d2e]">
        <h3 className="text-base font-semibold text-primary font-serif mb-2 group-hover:text-primary transition-colors">
          {category.title}
        </h3>
        <p className="text-gray-500 text-sm mb-3">{category.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-medium">
            {category.posts_count} sản phẩm
          </span>
          <FaBeer className="text-primary text-lg" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCategoryCard;


