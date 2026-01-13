/* eslint-disable */

import { Uppy, State, type Meta, type Body } from "@uppy/core";
import { useMemo } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

// TODO: types need to wait https://github.com/transloadit/uppy/issues/4698
export function useUppyState<
    T,
    TMeta extends Meta = Meta,
    TBody extends Body = Body
>(uppy: Uppy<TMeta, TBody>, selector: (state: State<TMeta, TBody>) => T) {
    const store = (uppy as any).store;

    const subscribe = useMemo(() => store.subscribe.bind(store), [store]);
    const getSnapshot = useMemo(() => store.getState.bind(store), [store]);

    return useSyncExternalStoreWithSelector(
        subscribe,
        getSnapshot,
        getSnapshot,
        selector
    );
}

// 1. subscribe - 订阅函数
//   2. getSnapshot - 客户端快照
//   3. getServerSnapshot - 服务端快照（SSR 用，这里复用同一个）
//   4. selector - 选择器
