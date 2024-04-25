import { observer } from 'mobx-react-lite'
import { lazy } from 'react'
import { useRoutes } from 'react-router-dom'
import PlayerContext from '../store/PlayerContext'

// react-router 6.x

// 把字符串组件 => 组件标签
export function load(name: string) {
  const Page = lazy(() => import(`../screen/${name}`).catch(error => {
    console.error("Failed to load module:", error);
    throw error;
  }))
  console.log('imported '+ name)
  return <Page></Page>
}

// 路由对象
function MyRouter() {
  const router = useRoutes(PlayerContext.routes)
  console.log(router)
  return router
}

export default observer(MyRouter)