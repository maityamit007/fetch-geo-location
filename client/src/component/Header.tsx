import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { AppDispatch, AppState } from '../redux/store';
import { signOut } from '../redux/user/userSlice';

export default function Header() {
  const { currentUser } = useSelector((state: AppState) => state.user);
  const dispatch: AppDispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='bg-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold'>Web Reinvent</h1>
        </Link>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li>Home</li>
          </Link>

          <Link to='/profile'>
            {currentUser ? (
              <li onClick={() => { handleSignOut() }}>Sign out</li>
            ) : (
              <Link to='/sign-in'>Sign In</Link>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
