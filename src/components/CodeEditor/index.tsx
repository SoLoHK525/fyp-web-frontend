import dynamic from 'next/dynamic';

export default dynamic(() => import('./CodeEditor'), {
  ssr: false,
  loading: () => <span>Loading...</span>,
});
