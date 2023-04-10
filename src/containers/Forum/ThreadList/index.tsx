import { FC } from 'react';
import { getForumThreads, Thread } from '../../../api/forum';
import { useQuery } from 'react-query';
import { Box, Card, Grid, Paper, Stack, Typography } from '@mui/material';
import Link from '../../../components/Link';
import routes from '../../../utils/routes';
import ReactAvatar from 'react-avatar';

const ThreadCard: FC<{
  thread: Thread
}> = ({
        thread,
      }) => {
  return (

    <Link href={routes.thread(thread.name)}>
      <Card>
        <Box display='flex' alignItems='center' p={2}>
          <Box mr={2}>
            <ReactAvatar name={thread.name} size='50' textSizeRatio={1.75} round />
          </Box>
          <Box>
            <Box fontWeight='bold'>{thread.name}
            </Box>
            <Typography color='gray'>{thread.description}</Typography>
          </Box>
        </Box>
      </Card>
    </Link>
  );
};

const ThreadList: FC = () => {
  const { data: threads } = useQuery('getForumThreads', getForumThreads, {});

  return (
    <div>
      <Grid container mt={4} spacing={2}>
        {threads?.payload.map((thread) => (
          <Grid item lg={4} sm={6} xs={12}>
            <ThreadCard key={thread.id} thread={thread} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ThreadList;