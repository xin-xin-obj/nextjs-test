'use client'

import {trpc} from "@/utils/trpc";
import { useEffect } from "react";
// import { Form } from "@/components/ui/form"
export default function Test() {
  const helloQuery = trpc.hello.useQuery()
  useEffect(() => {
    console.log('data changed', helloQuery.data)
  }, [helloQuery.data])
  return (
    <div>
      <div>Test</div>
    </div>
  );
}
