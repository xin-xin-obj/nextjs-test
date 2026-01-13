import { getPublicCaller, getServerCaller } from '@/server/trpc/caller';

// 这是一个 Server Component，代码在服务端执行,  服务端调用内部接口
export default async function ServerTest() {
  // 使用公开 caller 调用 hello 接口
  const publicCaller = getPublicCaller();
  const helloResult = await publicCaller.hello();

  // 使用登录用户 caller（如果需要授权的接口）
  const serverCaller = await getServerCaller();
  // const posts = await serverCaller.post.list();

  return (
    <div style={{ padding: '20px' }}>
      <h1>服务端 Caller 调用示例</h1>

      <div style={{ marginTop: '20px' }}>
        <h2>hello 接口返回：</h2>
        <pre>{JSON.stringify(helloResult, null, 2)}</pre>
      </div>

      {/* <div style={{ marginTop: '20px' }}>
        <h2>post.list 接口返回：</h2>
        <pre>{JSON.stringify(posts, null, 2)}</pre>
      </div> */}
    </div>
  );
}