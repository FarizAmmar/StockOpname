import { Grid, Skeleton, Stack } from "@mantine/core";

export default function CardLoading() {
    return (
        <Grid>
            <Grid.Col span={12}>
                <div className="flex justify-between">
                    <Skeleton height={30} width="70%" mb="xs" />
                    <Skeleton height={30} width={30} mb="xs" circle />
                </div>
            </Grid.Col>
            <Grid.Col span={12}>
                <Grid>
                    <Grid.Col span={5}>
                        <Skeleton height={150} radius="sm" />
                    </Grid.Col>
                    <Grid.Col span={7}>
                        <Stack spacing="xs">
                            <Skeleton height={20} width="80%" mb="xs" />
                            <Skeleton height={20} width="70%" mb="xs" />
                            <Skeleton height={20} width="60%" mb="xs" />
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Grid.Col>
        </Grid>
    );
}
