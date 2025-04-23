import { useState, useEffect, useCallback } from 'react';
import { getCompanies, Company } from '@/services/company';
import { Pagination } from '@/services/types';

export const useCompany = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<Pagination | undefined>();
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const payload = {
        search: search,
        page,
        limit,
      };
      const response = await getCompanies(payload);
      setPagination(response.pagination || {});
      setCompanies(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const onChangePagination = (page?: number, pageSize?: number) => {
    setPagination({
      ...pagination,
      page,
      limit: pageSize,
    });
    fetchData(page, pageSize);
  };

  return {
    companies,
    pagination,
    search,
    setSearch,
    loading,
    fetchData,
    onChangePagination
  };
};