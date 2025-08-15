package com.kunkunyu.vote;

import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.server.ServerRequest;
import java.util.UUID;

import static com.kunkunyu.vote.Vote.Cookie;

public class VoteUtils {

    public static String getSessionKey(ServerRequest request) {
        String sessionKey = "";
        MultiValueMap<String, HttpCookie> cookies = request.exchange().getRequest().getCookies();
        if (cookies.containsKey(Cookie)) {
            sessionKey = (cookies.getFirst(Cookie)).getValue();
        } else {
            sessionKey = UUID.randomUUID().toString();
            ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(Cookie, sessionKey).path("/").httpOnly(true);
            request.exchange().getResponse().addCookie(builder.build());
        }
        return sessionKey;
    }
}
