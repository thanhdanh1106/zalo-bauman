import { postCategoryProps } from '@shared/types/post';
import { getThumbnailUrl } from '@shared/utils/Hooks';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

type Props = { brand: postCategoryProps };

const BrandCard = (props: Props) => {
  const { brand } = props;
  const logoUrl = getThumbnailUrl(brand?.thumbnail);

  return (
    <Link
      key={brand.id}
      to={`/products?brand=${brand.id}`}
      className="group block relative overflow-hidden rounded-lg border border-[#eee] hover:border-[#cbb27c] transition-all duration-300 bg-background"
    >
      <div className="aspect-square p-6 flex items-center justify-center bg-gradient-to-br from-[#1a1d20] to-[#2a2d2e]">
        <img
          src={logoUrl}
          alt={brand.name}
          className="w-full h-full object-contain max-w-[120px] max-h-[120px] group-hover:scale-110 transition-transform duration-300 filter brightness-90 group-hover:brightness-100"
        />
      </div>
      <div className="p-4 bg-background border-t border-[#eee]">
        <h3 className="text-lg font-semibold text-primary font-serif mb-1 group-hover:text-primary transition-colors text-center">
          {brand.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-primary font-medium text-sm">
            {brand.posts_count || 0} sản phẩm
          </span>
          <FaStar className="text-primary text-sm" />
        </div>
      </div>
    </Link>
  );
};

export default BrandCard;


