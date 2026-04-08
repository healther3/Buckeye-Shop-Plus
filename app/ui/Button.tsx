import clsx from 'clsx';    
import { deleteUser, deleteProduct, deleteListItem } from '../lib/actions';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center rounded-lg bg-red-800 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 active:bg-red-900 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DeleteCartItem({id} : {id: string}){
  const deleteItemWithId = deleteListItem.bind(null, id);
  
  return(
    <form action={deleteItemWithId}>
      <button type='submit' className='cursor-pointer bg-red-600 border-black border-2'>Remove</button>
    </form>
  );
}

