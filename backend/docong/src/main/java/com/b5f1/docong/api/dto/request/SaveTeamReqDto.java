package com.b5f1.docong.api.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class SaveTeamReqDto {
    private Long userId;
    private String name;

}