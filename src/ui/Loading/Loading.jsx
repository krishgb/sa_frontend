import { Skeleton, Stack } from "@chakra-ui/react"

export default function Loading({height}) {
    return (
      <Stack padding={4} spacing={1}>
        <Skeleton height={height?.length ? height : '40px'} />
        <Skeleton height={height?.length ? height : '40px'} />
        <Skeleton height={height?.length ? height : '40px'} />
        <Skeleton height={height?.length ? height : '40px'} />
        <Skeleton height={height?.length ? height : '40px'} />
        <Skeleton height={height?.length ? height : '40px'} />
        <Skeleton height={height?.length ? height : '40px'} />
      </Stack>
    )
  }