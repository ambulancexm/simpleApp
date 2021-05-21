package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MxCellTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MxCell.class);
        MxCell mxCell1 = new MxCell();
        mxCell1.setId(1L);
        MxCell mxCell2 = new MxCell();
        mxCell2.setId(mxCell1.getId());
        assertThat(mxCell1).isEqualTo(mxCell2);
        mxCell2.setId(2L);
        assertThat(mxCell1).isNotEqualTo(mxCell2);
        mxCell1.setId(null);
        assertThat(mxCell1).isNotEqualTo(mxCell2);
    }
}
