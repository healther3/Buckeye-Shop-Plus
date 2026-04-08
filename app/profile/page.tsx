import { auth } from '@/auth';
import Link from 'next/link';
import ChangePassowordForm from '../ui/change-password-form';
import { fetchProduct, fetchUserByAuthUser, fetchWishList } from '../lib/data';
import Image from 'next/image';

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  const list = await fetchWishList(user?.id || "") ?? [];
  const shorList = list.slice(0, 3);
  const wishlistProducts = await Promise.all(
    shorList.map(async (item) => {
      const product = await fetchProduct(item.product_id);
      return product;
    })
  );

  const currentUser = await fetchUserByAuthUser();
  console.log(currentUser);
  return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="bg-white shadow rounded-lg p-6 flex items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl overflow-hidden">
          {currentUser?.imageUrl ? (
            <div className="relative h-full w-full">
              <Image
                src={currentUser.imageUrl}
                alt={currentUser.name || 'User'}
                fill
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <span>👤</span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.name}
          </h1>
          <p className="text-gray-500">{user?.email}</p>
          <div className="mt-2 flex gap-2"> 
    
          <Link 
            href="profile/edit-avatars" 
            className="px-3 py-1 bg-red-800 text-white text-xs rounded-full hover:bg-red-700 transition-colors"
          >
              change user avatar
          </Link>

          <Link 
            href="profile/edit-address"  
            className="px-3 py-1 bg-red-800 text-white text-xs rounded-full hover:bg-red-700 transition-colors"
          >
              create user address
          </Link>

        </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-6 rounded-lg bg-gray-50">
          <h2 className="font-bold text-lg mb-4">My Orders</h2>
          <p className="text-gray-500">No recent orders.</p>
        </div>
        {/*wish List*/}
        <div className="border p-6 rounded-lg bg-gray-50">
          <h2 className="font-bold text-lg mb-4">Wish List</h2>

          {wishlistProducts.length === 0 && (
            <p className="text-gray-500">Your wishlist is empty.</p>
          )}
          {/**curate products */}
          <div className="space-y-4">
            {wishlistProducts.map((product) => (
              <div
                key={product[0].id}
                className="flex items-center gap-4 p-3 bg-white shadow-sm rounded-lg hover:shadow-md transition"
              >
                {/* Product Image */}
                <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
                  {product[0].url ? (
                    <Image
                      src={product[0].url}
                      alt={product[0].name}
                      width={80}
                      height={80}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-3xl">📦</span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="text-md font-semibold text-gray-900">
                    {product[0].name}
                  </h3>
                  <p className="text-sm text-gray-500">${product[0].price}</p>

                  <div className="mt-2 flex gap-2">
                    <Link
                      href='/profile/wishlist'
                      className="text-xs px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-black"
                    >
                      View
                    </Link>

                    <form action="" method="POST">
                      <input type="hidden" name="productId" value={product[0].id} />
                      <button
                        type="submit"
                        className="text-xs px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border p-6 rounded-lg bg-gray-50">
          <h2 className="font-bold text-lg mb-4">Account Settings</h2>
          <ChangePassowordForm user={currentUser} />
        </div>
      </div>
    </div>
  );
}