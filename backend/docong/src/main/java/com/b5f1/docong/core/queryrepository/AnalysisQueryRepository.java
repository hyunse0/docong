package com.b5f1.docong.core.queryrepository;

import com.b5f1.docong.api.dto.response.FindRankingResDto;

import java.util.List;

public interface AnalysisQueryRepository {
    List<FindRankingResDto> findPomoRanking();
}
