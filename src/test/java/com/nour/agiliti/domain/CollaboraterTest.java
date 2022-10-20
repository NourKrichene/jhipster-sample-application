package com.nour.agiliti.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.nour.agiliti.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CollaboraterTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Collaborater.class);
        Collaborater collaborater1 = new Collaborater();
        collaborater1.setId(1L);
        Collaborater collaborater2 = new Collaborater();
        collaborater2.setId(collaborater1.getId());
        assertThat(collaborater1).isEqualTo(collaborater2);
        collaborater2.setId(2L);
        assertThat(collaborater1).isNotEqualTo(collaborater2);
        collaborater1.setId(null);
        assertThat(collaborater1).isNotEqualTo(collaborater2);
    }
}
