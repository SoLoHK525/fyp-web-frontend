import CustomAppBar from '../AppBar';
import { Box, Container } from '@mui/material';
import Footer from '../../components/Footer';

export default function Dashboard() {
  return <>
    <CustomAppBar />
    <Box minHeight="50vh">
      <Container>
        <h1>Dashboard</h1>
        <div>
          {/* generate 1000 words of lorem ipsum */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies aliquam, nunc nisl aliquet nunc, eget aliq uam sapien nunc et nunc. Null
          a nunc sit amet nisl lacinia aliqua
          m nec eu nisl
        </div>
      </Container>
    </Box>
    <Footer />
  </>;
}