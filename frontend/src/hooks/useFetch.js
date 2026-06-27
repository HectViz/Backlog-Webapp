import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function useFetch(actionCreator, selector, params = null) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(selector);

  const paramsStr = JSON.stringify(params);

  const refetch = useCallback(() => {
    dispatch(actionCreator(params));
  }, [dispatch, actionCreator, paramsStr]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data: items, loading, error, refetch };
}

export default useFetch;
